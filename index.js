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

if (typeof window !== 'undefined' && window) {
  window.SL = window.SL || {};
  window.SL.Event = Event;
  window.SL.EventManager = EventManager;
  window.SL.EventNotifierMixin = EventNotifierMixin;
  window.SL.PriorityQueue = PriorityQueue;
  window.SL.Queue = Queue;
  window.SL.UniquePriorityQueue = UniquePriorityQueue;

  window.SL.BackgroundLayer = BackgroundLayer;
  window.SL.CanvasContextWrapper = CanvasContextWrapper;
  window.SL.EventType = EventType;
  window.SL.GfxElement = GfxElement;
  window.SL.GfxElementZIndexComparable = GfxElementZIndexComparable;
  window.SL.GfxLayer = GfxLayer;
  window.SL.ILayerFactory = ILayerFactory;
  window.SL.ImageElement = ImageElement;
  window.SL.ImageLoader = ImageLoader;
  window.SL.ImageRenderer = ImageRenderer;
  window.SL.ImageSprite = ImageSprite;
  window.SL.ImageSpriteFrame = ImageSpriteFrame;
  window.SL.Layer = Layer;
  window.SL.LayerFactory = LayerFactory;
  window.SL.MouseEvent = MouseEvent;
  window.SL.MoveOrder = MoveOrder;
  window.SL.Screen = Screen;
  window.SL.Sprite = Sprite;
  window.SL.SpriteAnimationFrame = SpriteAnimationFrame;
  window.SL.Utils = Utils;
}
