import { getBusinessObject } from "../util/Util";

export default class UpdatePropertyHandler {
  constructor(eventBus) {
    this._eventBus = eventBus;
  }

  execute(context) {
    const { element, propertyName, newValue } = context;
    const hints = context.hints || {};
    const businessObject = getBusinessObject(element);

    // Store old value for revert
    context.oldValue = businessObject[propertyName];

    businessObject[propertyName] = newValue;

    if (hints.rerender) {
      this._eventBus.fire("element.changed", { element });
    }
  }

  revert(context) {
    const { element, propertyName, oldValue } = context;
    const hints = context.hints || {};
    const businessObject = getBusinessObject(element);
    
    businessObject[propertyName] = oldValue;

    if (hints.rerender) {
      this._eventBus.fire("element.changed", { element });
    }
  }
}
