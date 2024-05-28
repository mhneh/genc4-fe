/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import * as React from "react";
import {Keys} from "@app/core";
import {DefaultAppearance} from "@app/wireframes/interface";
import {Diagram, DiagramItem, DiagramItemSet} from "@app/wireframes/model";
import {InteractionHandler, InteractionService, SvgEvent,} from "../../interaction/interaction-service.ts";

export interface TextAdornerProps {
  // The current zoom value.
  zoom: number;

  // The selected diagram.
  selectedDiagram: Diagram;

  // The selected items.
  selectionSet: DiagramItemSet;

  // The interaction service.
  interactionService: InteractionService;

  // A function to change the appearance of a visual.
  onChangeItemsAppearance: (
    diagram: Diagram,
    visuals: DiagramItem[],
    key: string,
    val: any
  ) => any;

  onLinkContainer: (selectedItem: DiagramItem) => void;

  toggleDescModal: () => void;
}

export class TextAdorner
  extends React.PureComponent<TextAdornerProps>
  implements InteractionHandler
{
  private readonly style = {
    display: "none ",
  };
  private selectedShape: DiagramItem | null = null;
  private textareaElement: HTMLTextAreaElement = null!;

  public componentDidMount() {
    this.props.interactionService.addHandler(this);

    window.addEventListener("mousedown", this.handleMouseDown);
  }

  public componentWillUnmount() {
    this.props.interactionService.removeHandler(this);

    window.removeEventListener("mousedown", this.handleMouseDown);
  }

  public componentDidUpdate(prevProps: TextAdornerProps) {
    if (this.props.selectionSet !== prevProps.selectionSet) {
      this.updateText();
    }
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.target !== this.textareaElement) {
      this.hide();
    }
  };

  public onDoubleClick(event: SvgEvent) {
    if (event.shape && !event.shape.isLocked && this.textareaElement) {
      if (!event.shape.type) {
        return;
      }
      if (
        event.shape.type === "Contexts" ||
        event.shape.type === "Containers" ||
        event.shape.type === "Components"
      ) {
        this.props.onLinkContainer(
          event.shape
        );
        return;
      }

      this.props.interactionService.hideAdorners();

      this.selectedShape = event.shape;

      if (event.shape.type == "Screens") {
        this.props.toggleDescModal();
      }
    }
  }

  private doInitialize = (textarea: HTMLTextAreaElement) => {
    this.textareaElement = textarea;
  };

  private doHide = () => {
    this.hide();
  };

  private doSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((Keys.isEnter(event) && !event.shiftKey) || Keys.isEscape(event)) {
      if (Keys.isEnter(event)) {
        this.updateText();
      } else {
        this.hide();
      }

      this.hide();

      event.preventDefault();
      event.stopPropagation();
    }
  };

  private updateText() {
    if (!this.selectedShape) {
      return;
    }

    const newText = this.textareaElement.value;
    const oldText = this.selectedShape.text;

    if (newText !== oldText) {
      this.props.onChangeItemsAppearance(
        this.props.selectedDiagram,
        [this.selectedShape],
        DefaultAppearance.TEXT,
        newText
      );
    }

    this.hide();
  }

  private hide() {
    this.selectedShape = null;

    this.textareaElement.style.width = "0";
    this.textareaElement.style.display = "none";

    this.props.interactionService.showAdorners();
  }

  public render() {
    return (
      <textarea
        className="ant-input no-border-radius"
        style={this.style}
        ref={this.doInitialize}
        onBlur={this.doHide}
        onKeyDown={this.doSubmit}
      />
    );
  }
}
