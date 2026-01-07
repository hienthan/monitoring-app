import { Container } from "../types/server";

export const containersMock: Container[] = [
  {
    id: "ctr-1",
    serverId: "srv-1",
    name: "web-frontend",
    image: "nginx:1.25",
    ports: [
      { host: 80, container: 80, protocol: "tcp" },
      { host: 443, container: 443, protocol: "tcp" },
    ],
    owner: "team-web",
    restartPolicy: "always",
  },
  {
    id: "ctr-2",
    serverId: "srv-2",
    name: "api-service",
    image: "node:20-alpine",
    ports: [{ host: 3000, container: 3000, protocol: "tcp" }],
    owner: "team-api",
    restartPolicy: "unless-stopped",
  },
  {
    id: "ctr-3",
    serverId: "srv-3",
    name: "postgres-db",
    image: "postgres:15",
    ports: [{ host: 5432, container: 5432, protocol: "tcp" }],
    owner: "team-data",
    restartPolicy: "always",
  },
];
