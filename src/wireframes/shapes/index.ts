/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import {RendererService} from "@app/wireframes/model/renderer/RendererService.ts";
import {Register} from "@app/wireframes/shapes/components/register.ts";
import {C4Control} from "@app/wireframes/model/renderer/impl/C4Control.ts";
import {SignIn} from "@app/wireframes/shapes/components/signin.ts";
import {Post} from "@app/wireframes/shapes/components/post.ts";
import {ResetPassword} from "@app/wireframes/shapes/components/reset-password.ts";
import {Authentication} from "@app/wireframes/shapes/components/authentication.ts";
import {EmailComponent} from "@app/wireframes/shapes/components/email.ts";
import {Database} from "@app/wireframes/shapes/containers/database.ts";
import {SinglePageApplication} from "@app/wireframes/shapes/containers/spa.ts";
import {ApiApplication} from "@app/wireframes/shapes/containers/api-application.ts";
import {EmailSystem} from "@app/wireframes/shapes/contexts/email-system.ts";
import {PersonalOwner} from "@app/wireframes/shapes/contexts/person.ts";
import {RelationshipControl} from "@app/wireframes/model/renderer/impl/RelationshipControl.ts";
import {Relationship} from "@app/wireframes/shapes/components/relationship.ts";
import {AbstractControl} from "../model/renderer/impl/AbstractControl.ts";
import {EmptySystem} from "./contexts/empty-system.ts";
import {
  Browser,
  Button,
  ButtonBar,
  Checkbox,
  ComboBox,
  Dropdown,
  Grid,
  Heading,
  HorizontalLine,
  HorizontalScrollbar,
  Icon,
  Label,
  Link,
  List,
  Numeric,
  Paragraph,
  Phone,
  Progress,
  RadioButton,
  Raster,
  Rectangle,
  Shape,
  Slider,
  Tablet,
  Tabs,
  TextArea,
  TextInput,
  Toggle,
  VerticalLine,
  VerticalScrollbar,
} from "./dependencies";
import {ExternalSystem} from "@app/wireframes/shapes/contexts/external-system.ts";
import {EmptyComponent} from "@app/wireframes/shapes/components/empty-component.ts";
import {EmptyContainer} from "@app/wireframes/shapes/containers/empty-container.ts";
import {CreateScreen} from "./screens/create.ts";
import {ViewScreen} from "./screens/view.ts";
import {UpdateScreen} from "./screens/update.ts";
import {OtherScreen} from "./screens/other.ts";
import {ListScreen} from "@app/wireframes/shapes/screens/list.ts";
import {SpecsService} from "@app/wireframes/model/renderer/SpecsService.ts";

import postSpecs from '@app/specs/blog/post.json';
import authenticationSpecs from '@app/specs/blog/authentication.json';
import userSpecs from '@app/specs/blog/user.json';
import {Serializer} from "@app/wireframes/model";
import {User} from "@app/wireframes/shapes/components/user.ts";

export function registerShapeRenderers() {
  // RendererService.addRenderer(new AbstractControl(new Browser()));
  // RendererService.addRenderer(new AbstractControl(new Button()));
  // RendererService.addRenderer(new AbstractControl(new ButtonBar()));
  // RendererService.addRenderer(new AbstractControl(new Checkbox()));
  // RendererService.addRenderer(new AbstractControl(new ComboBox()));
  // RendererService.addRenderer(new AbstractControl(new Dropdown()));
  // RendererService.addRenderer(new AbstractControl(new Grid()));
  // RendererService.addRenderer(new AbstractControl(new Heading()));
  // RendererService.addRenderer(new AbstractControl(new HorizontalLine()));
  // RendererService.addRenderer(new AbstractControl(new HorizontalScrollbar()));
  // RendererService.addRenderer(new AbstractControl(new Icon()));
  // RendererService.addRenderer(new AbstractControl(new Image()));
  // RendererService.addRenderer(new AbstractControl(new Label()));
  // RendererService.addRenderer(new AbstractControl(new Link()));
  // RendererService.addRenderer(new AbstractControl(new List()));
  // RendererService.addRenderer(new AbstractControl(new Numeric()));
  // RendererService.addRenderer(new AbstractControl(new Paragraph()));
  // RendererService.addRenderer(new AbstractControl(new Phone()));
  // RendererService.addRenderer(new AbstractControl(new Progress()));
  // RendererService.addRenderer(new AbstractControl(new RadioButton()));
  // RendererService.addRenderer(new AbstractControl(new Raster()));
  // RendererService.addRenderer(new AbstractControl(new Rectangle()));
  // RendererService.addRenderer(new AbstractControl(new Shape()));
  // RendererService.addRenderer(new AbstractControl(new Slider()));
  // RendererService.addRenderer(new AbstractControl(new Tablet()));
  // RendererService.addRenderer(new AbstractControl(new Tabs()));
  // RendererService.addRenderer(new AbstractControl(new TextArea()));
  // RendererService.addRenderer(new AbstractControl(new TextInput()));
  // RendererService.addRenderer(new AbstractControl(new Toggle()));
  // RendererService.addRenderer(new AbstractControl(new VerticalLine()));
  // RendererService.addRenderer(new AbstractControl(new VerticalScrollbar()));
  // RendererService.addRenderer(new AbstractControl(new Window()));
  // RendererService.addRenderer(new AbstractControl(new Comment()));
  // RendererService.addRenderer(new AbstractControl(new Icon()));
  // RendererService.addRenderer(new AbstractControl(new Raster()));
}

export function registerComponents() {
  // Components
  // RendererService.addRenderer(new C4Control(new EmptyComponent()));
  // RendererService.addRenderer(new C4Control(new Register()));
  // RendererService.addRenderer(new C4Control(new SignIn()));
  RendererService.addRenderer(new C4Control(new Authentication()));
  RendererService.addRenderer(new C4Control(new User()));
  RendererService.addRenderer(new C4Control(new Post()));
  // RendererService.addRenderer(new C4Control(new ResetPassword()));
  // RendererService.addRenderer(new C4Control(new EmailComponent()));

  // Containers
  // RendererService.addRenderer(new C4Control(new EmptyContainer()));
  RendererService.addRenderer(new C4Control(new Database()));
  // RendererService.addRenderer(new C4Control(new SinglePageApplication()));
  RendererService.addRenderer(new C4Control(new ApiApplication()));

  // Contexts
  RendererService.addRenderer(new C4Control(new PersonalOwner()));
  // RendererService.addRenderer(new C4Control(new ExternalSystem()));
  RendererService.addRenderer(new C4Control(new EmailSystem()));
  // RendererService.addRenderer(new C4Control(new EmptySystem()));

  //   Screens
  RendererService.addRenderer(new C4Control(new CreateScreen()));
  RendererService.addRenderer(new C4Control(new ViewScreen()));
  RendererService.addRenderer(new C4Control(new UpdateScreen()));
  RendererService.addRenderer(new C4Control(new OtherScreen()));
  RendererService.addRenderer(new C4Control(new ListScreen()));

  RendererService.addRenderer(new RelationshipControl(new Relationship()));
}

export function registerSpecs() {
  SpecsService.addSpecs(new Post().identifier(), Serializer.deserializeDiagram(postSpecs));
  SpecsService.addSpecs(new Authentication().identifier(), Serializer.deserializeDiagram(authenticationSpecs));
  SpecsService.addSpecs(new User().identifier(), Serializer.deserializeDiagram(userSpecs));
}
