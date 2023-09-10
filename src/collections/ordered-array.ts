export class OrderedArray<T> implements Iterable<T> {
  private array: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {}

  public get length(): number {
    return this.array.length;
  }

  public get(index: number) {
    return this.array[index];
  }

  public remove(index: number) {
    this.array.splice(index, 1);
  }

  public indexOf(value: T) {
    // Do a binary search to find the index of this value
    // TODO: maybe we should consider using linear search for small (< 10) arrays

    let left = 0;
    let right = this.array.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = this.compare(value, this.array[mid]!);

      if (comparison < 0) {
        right = mid;
      } else if (comparison > 0) {
        left = mid + 1;
      } else {
        return mid;
      }
    }

    return left;
  }

  public push(value: T) {
    // Do a binary search to find the index of this value
    const index = this.indexOf(value);
    this.array.splice(index, 0, value);
  }

  public pop() {
    return this.array.pop();
  }

  public clear() {
    this.array = [];
  }

  public addAll(other: Iterable<T>) {
    // To add all from another array, we will perform a sorted merge
    // and replace the current array with the resulting one
    const newArray: T[] = [];

    const thisIterator = this[Symbol.iterator]();
    let thisItem = thisIterator.next();

    const otherIterator = other[Symbol.iterator]();
    let otherItem = otherIterator.next();

    // If we haven't reached the end of either array, add the
    // value in the leftmost position (according to the `compare` function)
    // and advance the corresponding iterator

    while (!thisItem.done && !otherItem.done) {
      const comparison = this.compare(thisItem.value, otherItem.value);

      if (comparison <= 0) {
        newArray.push(thisItem.value);
        thisItem = thisIterator.next();
      } else {
        newArray.push(otherItem.value);
        otherItem = otherIterator.next();
      }
    }

    // At this point, we have reached the end of one (or both) of the iterators
    // Therefore, we just need to add all of the remaining items

    while (!thisItem.done) {
      newArray.push(thisItem.value);
      thisItem = thisIterator.next();
    }

    while (!otherItem.done) {
      newArray.push(otherItem.value);
      otherItem = otherIterator.next();
    }

    this.array = newArray;
  }

  public [Symbol.iterator]() {
    return this.array[Symbol.iterator]();
  }
}
