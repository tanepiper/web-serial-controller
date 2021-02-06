import { readable } from 'svelte/store';
import { fromFetch } from "rxjs/fetch";
import { switchMap, tap } from "rxjs/operators";
import { throwError } from "rxjs";

export const vendorStore = readable([], set => {
    fromFetch('/usbif.json')
        .pipe(
            switchMap((response) => {
                if (response.ok) {
                    return response.json();
                }
                return throwError(`${response.status} : ${response.statusText}`);
            }),
            tap((list) => {
                set(list)
            }),
        )
        .subscribe();

    return () => {

    }
})
