import { IKeyedComparable } from '@shaunlusk/slcommon';
import { IGfxElement } from './GfxElement';

/** Comparable for a GfxElement.  Used by GfxLayer to determine rendering order.
* @constructor
* @implements {IComparable}
* @param {IGfxElement} parentElement The element to create this comparable for.
*/
export class GfxElementZIndexComparable implements IKeyedComparable<GfxElementZIndexComparable> {
  private _parentElement: IGfxElement;
  
  constructor(parentElement: IGfxElement) {
    this._parentElement = parentElement;
  }

/** Returns the element for this elementComparable.
* @returns {GfxElement}
*/
public getElement(): IGfxElement {return this._parentElement;}

/**
* @implements {IComparable.compareTo}
* @param {GfxElementZIndexComparable} other The object to compare to this one.
* @returns {int} -1: less than the other object; 0 equivalent to the other object; 1 greater than the other object.
*/
public compareTo(other: GfxElementZIndexComparable) {
  if (this._parentElement.getZIndex() < other._parentElement.getZIndex()) return -1;
  if (this._parentElement.getZIndex() === other._parentElement.getZIndex()) return 0;
  return 1;
}

  /**
  * @implements {IComparable.equals}
  * @param {GfxElementZIndexComparable} other The object to compare to this one.
  * @returns {boolean} true if elements are equivalent, false otherwise.
  */
  public equals(other: GfxElementZIndexComparable) {
    return this._parentElement.getZIndex() === other._parentElement.getZIndex();
  }

  /**Returns this comparables key (uses Id from parent element).
  * Implementation for getKey for UniquePriorityQueue
  * @returns {string}
  */
  public getKey() {
    return this._parentElement.getId().toString();
  }

}
