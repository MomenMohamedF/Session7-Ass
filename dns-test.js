import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.fanzogv.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS ERROR:", err);
      return;
    }

    console.log("DNS SUCCESS:");
    console.log(addresses);
  },
);
