export function childOf(evt: FocusEvent, selfElm: Element): boolean {
    let tgt = evt.relatedTarget as Element;

    while (tgt) {
        if (tgt === selfElm)
            return true;
        tgt = tgt.parentElement;
    }
    return false;
}


let uuid = 0;

export function createId(): string {
    uuid++;
    return uuid.toString();
}