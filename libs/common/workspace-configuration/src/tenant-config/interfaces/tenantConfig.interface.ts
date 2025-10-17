// ========== 🔹 Shared Base Interfaces ==========

interface NumberGenerationBase {
    method?: string;
    prefix?: string;
}

// ========== 🔹 Customer-Specific Configs ==========

export interface CustomerNumberGenerationConfig extends NumberGenerationBase {}

export interface NewClientConfig {
    counter?: string;
    flag?: string;
}

export interface CustomerConfig {
    customerNumberGeneration?: CustomerNumberGenerationConfig;
    newClient?: NewClientConfig;
}

// ========== 🔹 Order-Specific Configs ==========

export interface OrderNumberGenerationConfig extends NumberGenerationBase {
    sequenceId?: string;
}

export interface OrderConfig {
    orderNumberGeneration?: OrderNumberGenerationConfig;
    orderNumberPrefix?: string;
    reprintOrderNumberPrefix?: string;
    orderAutoFinalize?: boolean;
    autoFinalizeDelay?: number;
    paymentRequiredForFinalize?: boolean;
}

// ========== 🔹 Line Item Configs ==========

export interface LineItemConfig {
    finalizeLineItemState?: string;
    injectionAtLineItemLevel?: boolean;
}

// ========== 🔹 Misc/General Store Configs ==========

export interface GeneralStoreConfig {
    autoTransitDRR?: boolean;
    dataClient?: string;
}

// ========== 🔹 Unified Default Config ==========

export interface DefaultConfig
  extends Partial<
    CustomerConfig &
    OrderConfig &
    LineItemConfig &
    GeneralStoreConfig
  > {}

// ========== 🔹 Generic Scalable Wrappers ==========

// Store level config
export interface StoreConfig<T = DefaultConfig> {
    [storeId: string]: T;
}

// Tenant level config, including top-level tenant "default"
export interface TenantConfig<T = DefaultConfig> {
    default?: T;
    [storeId: string]: StoreConfig<T> | T | undefined;
}

// Complete structure: maps tenant ID to their config
export interface TenantConfigData<T = DefaultConfig> {
    [tenantId: string]: TenantConfig<T>;
}