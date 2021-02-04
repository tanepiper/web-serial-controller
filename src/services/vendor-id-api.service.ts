import { fromFetch } from 'rxjs/fetch';
import { switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface VendorListItem {
  name: string;
  field_vid: string;
}

export class VendorIdApiService {
  /**
   * Static instance to ensire this is a singleton
   */
  static _instance: VendorIdApiService;

  private vendorList: VendorListItem[] = [];

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

  /**
   * Find vendor by ID
   * @param id
   */
  public findByVendorId(id: string | number | undefined): string {
    if (!id) {
      return 'Unknown';
    }
    const found = this.vendorList.find((item) => item.field_vid === `${id}`);
    return found ? found.name : 'Unknown';
  }
}

export const vendorService = new VendorIdApiService();
