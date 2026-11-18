import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const Picture = Schema.Struct({
  file: Schema.String,
  prompt: Schema.String,
  model: Schema.String,
  /** When it was made, in ms. */
  time: Schema.Number,
})

export type Picture = typeof Picture.Type

export const ImagesState = Schema.Struct({
  /** The folder pictures are saved in. */
  folder: Schema.String,
  /** Image models the router offers, best first. */
  models: Schema.Array(Schema.String),
  /** A picture is being made: what was asked, and since when (ms). */
  making: Schema.NullOr(Schema.Struct({ prompt: Schema.String, model: Schema.String, since: Schema.Number })),
  /** The newest first. */
  pictures: Schema.Array(Picture),
  /** Why the router could not be asked; null when fine. */
  problem: Schema.NullOr(Schema.String),
})

export type ImagesState = typeof ImagesState.Type

/** Making pictures through the router (OmniRoute) and keeping them in a folder on this PC. */
export const Images = Ipc.define({
  id: "apna-images",
  state: ImagesState,
  methods: {
    /** Asks the router again for its image models and reads the folder again. */
    refresh: {},
    /** Makes one picture; resolves with its file. Rejects with the router's message. */
    make: {
      input: Schema.Struct({
        prompt: Schema.String,
        model: Schema.String,
        size: Schema.String,
        /** A photo the user picked to change (img2img); null for a new picture. */
        photo: Schema.NullOr(Schema.String),
      }),
      output: Schema.String,
    },
    /** A photo the user picked, as a small data: URL to show in the composer. Only picture files are read. */
    photo: { input: Schema.String, output: Schema.String },
    /** A picture as a data: URL, for showing it in the window. */
    read: { input: Schema.String, output: Schema.String },
    /** Deletes a picture from the folder. */
    remove: { input: Schema.String },
  },
})
