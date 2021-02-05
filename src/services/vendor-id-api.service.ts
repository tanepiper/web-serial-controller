import { fromFetch } from 'rxjs/fetch';
import { switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface VendorListItem {
  label: string;
  value: string;
}

export class VendorIdApiService {
  /**
   * Static instance to ensire this is a singleton
   */
  static _instance: VendorIdApiService;

  public vendorList: VendorListItem[] = [];

  constructor() {
    if (VendorIdApiService._instance) {
      return VendorIdApiService._instance;
    }
    VendorIdApiService._instance = this;
  }

  getVendorList() {
    fromFetch('/usbif.json')
      .pipe(
        switchMap((response) => {
          if (response.ok) {
            return response.json();
          }
          return throwError(`${response.status} : ${response.statusText}`);
        }),
        tap((list) => {
          this.vendorList = list;
        }),
      )
      .subscribe();
  }

  public searchVendor(name: string) {
    return this.vendorList.filter((items) => items.label.toLowerCase().includes(name.toLowerCase()));
  }

  /**
   * Find vendor by ID
   * @param id
   */
  public findByVendorId(id: string | number | undefined): string {
    if (!id) {
      return 'Unknown';
    }
    const found = this.vendorList.find((item) => item.value === `${id}`);
    return found ? found.label : 'Unknown';
  }
}

export const vendorService = new VendorIdApiService();
