/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import {RendererService} from "@app/wireframes/model/renderer/RendererService.ts";
import {C4Control} from "@app/wireframes/model/renderer/impl/C4Control.ts";
import {Post} from "@app/wireframes/shapes/components/post/post.ts";
import {Authentication} from "@app/wireframes/shapes/components/common/authentication.ts";
import {Database} from "@app/wireframes/shapes/containers/database.ts";
import {Container} from "@app/wireframes/shapes/containers/container.ts";
import {EmailSystem} from "@app/wireframes/shapes/contexts/email-system.ts";
import {PersonalOwner} from "@app/wireframes/shapes/contexts/person.ts";
import {RelationshipControl} from "@app/wireframes/model/renderer/impl/RelationshipControl.ts";
import {Relationship} from "@app/wireframes/shapes/components/relationship.ts";
import {CreateScreen} from "./screens/create.ts";
import {ViewScreen} from "./screens/view.ts";
import {UpdateScreen} from "./screens/update.ts";
import {OtherScreen} from "./screens/other.ts";
import {ListScreen} from "@app/wireframes/shapes/screens/list.ts";
import {SpecsService} from "@app/wireframes/model/renderer/SpecsService.ts";

import postSpecs from '@app/specs/blog/post.json';
import authenticationSpecs from '@app/specs/blog/authentication.json';
import userSpecs from '@app/specs/blog/user.json';
import contactSpecs from '@app/specs/common/contact.json';
import aboutSpecs from '@app/specs/common/about.json';
import consultingSpecs from '@app/specs/common/consulting.json';
import postModuleSpecs from '@app/specs/blog/post-module.json';
import newsModuleSpecs from '@app/specs/blog/news-module.json';
import productModuleSpecs from '@app/specs/ecommerce/product-module.json';
import orderModuleSpecs from '@app/specs/ecommerce/order-module.json';
import serviceModuleSpecs from '@app/specs/ecommerce/service-module.json';
import partnerModuleSpecs from '@app/specs/ecommerce/partner-module.json';

import {Serializer} from "@app/wireframes/model";
import {User} from "@app/wireframes/shapes/components/common/user.ts";
import {Contact} from "@app/wireframes/shapes/components/common/contact.ts";
import {PostModule} from "@app/wireframes/shapes/modules/postModule.ts";
import {NewsModule} from "@app/wireframes/shapes/modules/newsModule.ts";
import {ProductModule} from "@app/wireframes/shapes/modules/productModule.ts";
import {OrderModule} from "@app/wireframes/shapes/modules/orderModule.ts";
import {About} from "@app/wireframes/shapes/components/common/about.ts";
import {ServiceModule} from "@app/wireframes/shapes/modules/serviceModule.ts";
import {PartnerModule} from "@app/wireframes/shapes/modules/partnerModule.ts";
import {Consulting} from "@app/wireframes/shapes/components/ecommerce/consulting.ts";
import {SearchScreen} from "@app/wireframes/shapes/screens/search.ts";

export function registerShapeRenderers() {
}

export function registerComponents() {
  // Components
  RendererService.addRenderer(new C4Control(new Authentication()));
  RendererService.addRenderer(new C4Control(new User()));
  RendererService.addRenderer(new C4Control(new Post()));
  RendererService.addRenderer(new C4Control(new PostModule()));
  RendererService.addRenderer(new C4Control(new NewsModule()));
  RendererService.addRenderer(new C4Control(new ProductModule()));
  RendererService.addRenderer(new C4Control(new OrderModule()));
  RendererService.addRenderer(new C4Control(new ServiceModule()));
  RendererService.addRenderer(new C4Control(new PartnerModule()));
  RendererService.addRenderer(new C4Control(new Contact()));
  RendererService.addRenderer(new C4Control(new About()));
  RendererService.addRenderer(new C4Control(new Consulting()));

  // Containers
  RendererService.addRenderer(new C4Control(new Database()));
  RendererService.addRenderer(new C4Control(new Container()));

  // Contexts
  RendererService.addRenderer(new C4Control(new PersonalOwner()));
  RendererService.addRenderer(new C4Control(new EmailSystem()));

  //   Screens
  RendererService.addRenderer(new C4Control(new CreateScreen()));
  RendererService.addRenderer(new C4Control(new ViewScreen()));
  RendererService.addRenderer(new C4Control(new UpdateScreen()));
  RendererService.addRenderer(new C4Control(new OtherScreen()));
  RendererService.addRenderer(new C4Control(new SearchScreen()));
  RendererService.addRenderer(new C4Control(new ListScreen()));

  RendererService.addRenderer(new RelationshipControl(new Relationship()));
}

export function registerSpecs() {
  SpecsService.addSpecs(new Post().identifier(), [Serializer.deserializeDiagram(postSpecs)]);
  SpecsService.addSpecs(new Authentication().identifier(), [Serializer.deserializeDiagram(authenticationSpecs)]);
  SpecsService.addSpecs(new User().identifier(), [Serializer.deserializeDiagram(userSpecs)]);
  SpecsService.addSpecs(new Contact().identifier(), [Serializer.deserializeDiagram(contactSpecs)]);
  SpecsService.addSpecs(new About().identifier(), [Serializer.deserializeDiagram(aboutSpecs)]);
  SpecsService.addSpecs(new Consulting().identifier(), [Serializer.deserializeDiagram(consultingSpecs)]);

  SpecsService.addSpecs(new PostModule().identifier(), Serializer.deserializeDiagrams(postModuleSpecs.children));
  SpecsService.addSpecs(new NewsModule().identifier(), Serializer.deserializeDiagrams(newsModuleSpecs.children));
  SpecsService.addSpecs(new ProductModule().identifier(), Serializer.deserializeDiagrams(productModuleSpecs.children));
  SpecsService.addSpecs(new OrderModule().identifier(), Serializer.deserializeDiagrams(orderModuleSpecs.children));
  SpecsService.addSpecs(new ServiceModule().identifier(), Serializer.deserializeDiagrams(serviceModuleSpecs.children));
  SpecsService.addSpecs(new PartnerModule().identifier(), Serializer.deserializeDiagrams(partnerModuleSpecs.children));
}
