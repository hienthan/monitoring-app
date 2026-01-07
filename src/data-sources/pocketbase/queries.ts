import { pb } from "./pb";
import { collections } from "./collections";

// Example helpers. In dev you can switch to mocks easily in repositories.

export const pocketbaseQueries = {
  listServers: () => pb.collection(collections.servers).getFullList(),
  listPorts: () => pb.collection(collections.ports).getFullList(),
  listContainers: () => pb.collection(collections.containers).getFullList(),
};
