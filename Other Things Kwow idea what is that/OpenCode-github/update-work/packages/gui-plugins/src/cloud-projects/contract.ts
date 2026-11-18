import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

/** One project folder on Cloud-SSD. */
export const CloudProject = Schema.Struct({
  name: Schema.String,
  /** The folder's full path on this machine. */
  directory: Schema.String,
})

export type CloudProject = typeof CloudProject.Type

export const CloudProjectsState = Schema.Struct({
  /** The projects folder inside Cloud-SSD's fast drive; null when Cloud-SSD is not installed or its fast drive is off. */
  folder: Schema.NullOr(Schema.String),
  projects: Schema.Array(CloudProject),
  /** When Cloud-SSD last finished uploading the projects folder, as epoch milliseconds; null before the first time. */
  uploadedAt: Schema.NullOr(Schema.Number),
  /** The folder being brought in right now; null while idle. */
  bringing: Schema.NullOr(Schema.String),
})

export type CloudProjectsState = typeof CloudProjectsState.Type

/** Coding projects kept in Cloud-SSD's fast drive: they run from this machine and Cloud-SSD uploads them by itself. */
export const CloudProjects = Ipc.define({
  id: "cloud-projects",
  state: CloudProjectsState,
  methods: {
    /** Looks for the fast drive and lists the projects again. */
    refresh: {},
    /** Makes an empty project folder and returns its path. Rejects when the name cannot be used or is taken. */
    create: { input: Schema.String, output: Schema.String },
    /**
     * Copies a folder into the projects folder under its own name and returns the new path. Folders a project builds
     * again by itself, such as `node_modules`, are left behind. The original is not touched.
     */
    bring: { input: Schema.String, output: Schema.String },
  },
})
