export class CustomerKeyGenerator {
  private readonly charSet: string;
  private readonly base: number;

  constructor() {
    this.charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    this.base = this.charSet.length;
  }

  private incrementId(currentId: string): string {
    if (currentId === '9999') {
      throw new RangeError('Identifier segment has reached its maximum value.');
    }

    if (!/^[a-z0-9]+$/.test(currentId)) {
      throw new Error('Invalid character in identifier');
    }

    const idArray = currentId.split('');
    let index = idArray.length - 1;

    while (index >= 0) {
      const char = idArray[index];
      const charPos = this.charSet.indexOf(char);

      if (charPos === -1) {
        throw new Error('Invalid character in identifier');
      }

      if (charPos < this.base - 1) {
        idArray[index] = this.charSet[charPos + 1];
        break;
      } else {
        idArray[index] = this.charSet[0];
        index--;
      }
    }

    if (index < 0) {
      throw new RangeError('Identifier segment has reached its maximum value.');
    }

    return idArray.join('');
  }

  public generateNextId(parentKey = '', lastAssignedKey = ''): string {
    const parentKeyDashCount = parentKey
      ? (parentKey.match(/-/g) || []).length
      : 0;
    const lastAssignedKeyDashCount = lastAssignedKey
      ? (lastAssignedKey.match(/-/g) || []).length
      : 0;

    if (parentKey && lastAssignedKey) {
      const parentKeySegments = parentKey.split('-');
      const lastAssignedKeySegments = lastAssignedKey.split('-');

      const sameHierarchy =
        parentKeyDashCount <= lastAssignedKeyDashCount &&
        lastAssignedKeyDashCount - parentKeyDashCount === 1 &&
        parentKeySegments.every(
          (seg, idx) => seg === lastAssignedKeySegments[idx],
        );

      if (!sameHierarchy) {
        throw new Error('Invalid Hierarchy input error');
      }
    }

    let nextSegment: string;

    if (!lastAssignedKey) {
      nextSegment = 'aaaa';
    } else {
      const lastSegment = lastAssignedKey.split('-').pop()!;
      nextSegment = this.incrementId(lastSegment);
    }

    return parentKey ? `${parentKey}-${nextSegment}` : nextSegment;
  }
}
