import {
    TenantConfigData
} from "../../../tenant-config/interfaces/tenantConfig.interface";

export const TENANTCONFIGDATA: TenantConfigData =  {
    "pixart": {
        "default": {
          "dataClient": "COMMERCETOOL"
        },
        "pixartprinting": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "PIX",
                    "method": "uuid"
                },
                "newClient": {
                    "counter": "confirm_items_ordered",
                    "flag": "user_newclient"
                },
                "finalizeLineItemState": "WaitingForDocReview",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 30,
                "paymentRequiredForFinalize": true,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "PIX",
                "reprintOrderNumberPrefix": "PRP",
                "autoTransitDRR": true,
                "injectionAtLineItemLevel": false,
                "dataClient": "COMMERCETOOL"
            }
        },
        "ogat": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "OGA",
                    "method": "uuid"
                },
                "newClient": {
                    "counter": "confirm_items_ordered",
                    "flag": "user_newclient"
                },
                "finalizeLineItemState": "WaitingForDocReview",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 30,
                "paymentRequiredForFinalize": false,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "OGA",
                "reprintOrderNumberPrefix": "ORP",
                "autoTransitDRR": false,
                "injectionAtLineItemLevel": false
            }
        },
        "hub": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "LA",
                    "method": "microtime"
                },
                "newClient": {
                    "counter": "confirm_items_ordered",
                    "flag": "user_newclient"
                },
                "finalizeLineItemState": "ReadyForFulfillment",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 0,
                "paymentRequiredForFinalize": false,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "HUB",
                "reprintOrderNumberPrefix": "HRP",
                "autoTransitDRR": false,
                "injectionAtLineItemLevel": false
            }
        },
        "spacefolder": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "LA",
                    "method": "microtime"
                },
                "newClient": {
                    "counter": "confirm_items_ordered",
                    "flag": "user_newclient"
                },
                "finalizeLineItemState": "WaitingForDocReview",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 0,
                "paymentRequiredForFinalize": true,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "SPC",
                "reprintOrderNumberPrefix": "SRP",
                "autoTransitDRR": false,
                "injectionAtLineItemLevel": false
            },
            "amt_services": {
                "paymentRequiredForFinalize": false,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberByExternalId"
                },
                "orderNumberPrefix": "API",
                "reprintOrderNumberPrefix": "ARP"
            }
        },
        "gifta": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "GIF",
                    "method": "uuid"
                },
                "newClient": {
                    "counter": "cx_confirm_items_ordered",
                    "flag": "cx_user_newclient"
                },
                "finalizeLineItemState": "WaitingForDocReview",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 0,
                "paymentRequiredForFinalize": true,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "GIF",
                "reprintOrderNumberPrefix": "GRP",
                "autoTransitDRR": false,
                "injectionAtLineItemLevel": false
            }
        },
        "canvas": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "GIF",
                    "method": "uuid"
                },
                "newClient": {
                    "counter": "cx_confirm_items_ordered",
                    "flag": "cx_user_newclient"
                }
            }
        }
    },
    "easyflyer": {
        "default": {
            "dataClient": "COMMERCETOOL"
        },
        "easyflyer": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "EFL",
                    "method": "uuid"
                },
                "newClient": {
                    "counter": "confirm_items_ordered",
                    "flag": "user_newclient"
                },
                "finalizeLineItemState": "WaitingForDocReview",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 30,
                "paymentRequiredForFinalize": true,
                "autoTransitDRR": true,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "EFL",
                "reprintOrderNumberPrefix": "ERP",
                "injectionAtLineItemLevel": false
            }
        }
    },
    "exaprint": {
        "default": {
            "dataClient": "COMMERCETOOL"
        },
        "exaprint": {
            "default": {
                "customerNumberGeneration": {
                    "prefix": "EXA",
                    "method": "uuid"
                },
                "newClient": {
                    "counter": "confirm_items_ordered",
                    "flag": "user_newclient"
                },
                "finalizeLineItemState": "WaitingForDocReview",
                "orderAutoFinalize": true,
                "autoFinalizeDelay": 30,
                "paymentRequiredForFinalize": true,
                "autoTransitDRR": true,
                "orderNumberGeneration": {
                    "method": "generateOrderNumberBySequenceApi",
                    "sequenceId": ""
                },
                "orderNumberPrefix": "EXA",
                "reprintOrderNumberPrefix": "XRP",
                "injectionAtLineItemLevel": false
            }
        }
    }
};