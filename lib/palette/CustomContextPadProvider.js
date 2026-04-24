import { assign } from "min-dash";
import { is, isAny } from "../util/Util";
import { MODELER_PREFIX } from "../util/constants";
import generatedIcons from "../util/generated-icons";

// In the context pad provider, the actions available in the context menu when selecting an element are defined.
export default class CustomContextPadProvider {
  constructor(
    connect,
    contextPad,
    modeling,
    elementFactory,
    create,
    autoPlace,
  ) {
    this._connect = connect;
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._create = create;
    this._autoPlace = autoPlace;

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const connect = this._connect;
    const modeling = this._modeling;
    const elementFactory = this._elementFactory;
    const create = this._create;
    const autoPlace = this._autoPlace;

    function removeElement() {
      modeling.removeElements([element]);
    }

    // CustomModelerTodoDone: Define functions for all entries in the context pad of an element.
    // For example, creating and appending new model elements.
    function startConnect(event, element, autoActivate) {
      connect.start(event, element, autoActivate);
    }

    function appendState(event, element) {
      const shape = elementFactory.createShape({
        type: `${MODELER_PREFIX}:State`,
      });

      autoPlace.append(element, shape, {
        connection: { type: `${MODELER_PREFIX}:Transition` },
      });
    }

    function appendStateStart(event) {
      const shape = elementFactory.createShape({
        type: `${MODELER_PREFIX}:State`,
      });

      create.start(event, shape, { source: element });
    }

    function appendFinalState(event, element) {
      const shape = elementFactory.createShape({
        type: `${MODELER_PREFIX}:FinalState`,
      });

      autoPlace.append(element, shape, {
        connection: { type: `${MODELER_PREFIX}:Transition` },
      });
    }

    function appendFinalStateStart(event) {
      const shape = elementFactory.createShape({
        type: `${MODELER_PREFIX}:FinalState`,
      });

      create.start(event, shape, { source: element });
    }

    const actions = {};

    // CustomModelerTodoDone: Define the context menu entries for each element type.
    // "group" is the row in which the action will be displayed. Within a row, elements are in the same order as they are assigned to the actions object.
    // "className" is the icon to be displayed.
    // "title" is the tooltip to be displayed.

    // State actions
    if (is(element, `${MODELER_PREFIX}:State`)) {
      if (!is(element, `${MODELER_PREFIX}:FinalState`)) {
        assign(actions, {
          "append-state": {
            group: "row_1",
            imageUrl: generatedIcons["olc-state"],
            title: "Append state",
            action: {
              click: appendState,
              dragstart: appendStateStart,
            },
          },
        });
      }
      if (!isAny(element, [`${MODELER_PREFIX}:InitialState`, `${MODELER_PREFIX}:FinalState`])) {
        assign(actions, {
          "append-final-state": {
            group: "row_2",
            imageUrl: generatedIcons["olc-final-state"],
            title: "Append final state",
            action: {
              click: appendFinalState,
              dragstart: appendFinalStateStart,
            },
          },
        });
      }
      if (!is(element, `${MODELER_PREFIX}:FinalState`)) {
        assign(actions, {
          connect: {
            group: "row_3",
            className: "bpmn-icon-connection",
            title: "Connect",
            action: {
              click: startConnect,
              dragstart: startConnect,
            },
          },
        });
      }
    }

    // Common actions
    assign(actions, {
      delete: {
        group: "row_4",
        className: "bpmn-icon-trash",
        title: "Remove",
        action: {
          click: removeElement,
          dragstart: removeElement,
        },
      },
    });
    return actions;
  }
}

CustomContextPadProvider.$inject = [
  "connect",
  "contextPad",
  "modeling",
  "elementFactory",
  "create",
  "autoPlace",
];
