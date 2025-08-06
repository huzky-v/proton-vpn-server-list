# proton-vpn-server-list

This is a list for quick checking on ipv4 / ipv6 address of the proton vpn servers (As of 2025-08-06), grouped by the location.  
Data include:
- Server Name
- Resolved IPv4 address (A)/ IPv6 address (AAAA, if any)
- IPv6 enabled flag
- City
- Server Info (Exit Node, Entry node, ED25519 Public key)

The data source is from the [Proton API](https://account.protonvpn.com/api/vpn/logicals), providing the following HTTP Headers
- x-pm-appversion
- x-pm-uid
- Cookie

The data script is also included for further customization if you have the api response file.