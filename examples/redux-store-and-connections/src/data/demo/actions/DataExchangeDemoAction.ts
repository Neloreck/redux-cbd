import {ActionWired, DataExchangeAction} from "@redux-cbd/core";

// Just simple exchange action. Creates constructor with generic param for direct payload insertion for reducer handlers.
@ActionWired("DATA_EXCHANGE_TEST_ACTION")
export class DataExchangeDemoAction extends DataExchangeAction<{ storedNumber: number }> {}
