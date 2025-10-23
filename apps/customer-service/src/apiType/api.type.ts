import { Injectable, Scope } from '@nestjs/common';
import { ApiType } from '../shared/enums/api-type.enum';

/**
 * Service to get and set the API type
 */
@Injectable({ scope: Scope.REQUEST })
export class ApiTypeService {
  private apiType: ApiType = ApiType.REST;

  /**
   * Set the API type
   * @param apiType
   */
  setApiType(apiType: ApiType) {
    this.apiType = apiType;
  }

  /**
   * Get the API type
   */
  getApiType(): ApiType {
    return this.apiType;
  }
}
