# proton-vpn-server-list

This is a list for quick checking on ipv4 / ipv6 address of the proton vpn servers (As of 2025-08-12), grouped by the location.  
You can also have a quick check on [this list](https://list.proton.huzky.dev/) also created by me.  
This list will not include the SE- config because there is some data inconsistency with the country config.   

This list will not update in regular basis as there is no easy way to automate this.  

Data include:
- Server Name
- Resolved IPv4 address (A)/ IPv6 address (AAAA, if any)
- IPv6 enabled flag
- City
- Server Info (Exit Node, Entry node, ED25519 Public key)

The data source is from the [Undocumented Proton Endpoint](https://account.protonvpn.com/api/vpn/logicals), providing the following HTTP Headers   
(you can even save the response by going to [this page](https://account.protonvpn.com/downloads) after login, you can find the `/vpn/logicals` request in the network inspect section)
- x-pm-appversion
- x-pm-uid
- Cookie (This is the reason why it is not easily automated, it is not API token)

The data script is also included for further customization if you have the api response file.