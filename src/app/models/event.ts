export interface Event {
  channel: string,
  name: string,
  startAt: Date,
  endAt: Date,
  startFormat: string,
  endFormat: string,
  duration: number,
  style: Style
}

export interface Style {
  left: string,
  width: string,
  background: string|null|undefined
}
