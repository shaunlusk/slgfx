import Event from 'slcommon/src/Event';
import EventManager from 'slcommon/src/EventManager';
import EventNotifierMixin from 'slcommon/src/EventNotifierMixin';
import PriorityQueue from 'slcommon/src/PriorityQueue';
import Queue from 'slcommon/src/Queue';
import UniquePriorityQueue from 'slcommon/src/UniquePriorityQueue';

import BackgroundLayer from './src/BackgroundLayer';
import CanvasContextWrapper from './src/CanvasContextWrapper';
import EventType from './src/EventType';
import GfxElement from './src/GfxElement';
import GfxElementZIndexComparable from './src/GfxElementZIndexComparable';
import GfxLayer from './src/GfxLayer';
import ILayerFactory from './src/ILayerFactory';
import ImageElement from './src/ImageElement';
import ImageLoader from './src/ImageLoader';
import ImageRenderer from './src/ImageRenderer';
import ImageSprite from './src/ImageSprite';
import ImageSpriteFrame from './src/ImageSpriteFrame';
import Layer from './src/Layer';
import LayerFactory from './src/LayerFactory';
import MouseEvent from './src/MouseEvent';
import MoveOrder from './src/MoveOrder';
import Screen from './src/Screen';
import Sprite from './src/Sprite';
import SpriteAnimationFrame from './src/SpriteAnimationFrame';

import Utils from './src/Utils';

if (typeof self !== 'undefined' && self) {
  self.SL = self.SL || {};
  self.SL.Event = Event;
  self.SL.EventManager = EventManager;
  self.SL.EventNotifierMixin = EventNotifierMixin;
  self.SL.PriorityQueue = PriorityQueue;
  self.SL.Queue = Queue;
  self.SL.UniquePriorityQueue = UniquePriorityQueue;

  self.SL.BackgroundLayer = BackgroundLayer;
  self.SL.CanvasContextWrapper = CanvasContextWrapper;
  self.SL.EventType = EventType;
  self.SL.GfxElement = GfxElement;
  self.SL.GfxElementZIndexComparable = GfxElementZIndexComparable;
  self.SL.GfxLayer = GfxLayer;
  self.SL.ILayerFactory = ILayerFactory;
  self.SL.ImageElement = ImageElement;
  self.SL.ImageLoader = ImageLoader;
  self.SL.ImageRenderer = ImageRenderer;
  self.SL.ImageSprite = ImageSprite;
  self.SL.ImageSpriteFrame = ImageSpriteFrame;
  self.SL.Layer = Layer;
  self.SL.LayerFactory = LayerFactory;
  self.SL.MouseEvent = MouseEvent;
  self.SL.MoveOrder = MoveOrder;
  self.SL.Screen = Screen;
  self.SL.Sprite = Sprite;
  self.SL.SpriteAnimationFrame = SpriteAnimationFrame;
  self.SL.Utils = Utils;
}
