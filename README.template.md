# proton-vpn-server-list

This is a list for quick checking on ipv4 / ipv6 address of the proton vpn servers (As of ${date}), grouped by the location.  
You can also have a quick check on [this list](https://list.proton.huzky.dev/) also created by me.  
This list will not include the multihop config because there is some data inconsistency with the country config.   

This list will not update in regular basis as there is no easy way to automate this (at least I don't want a login email everytime I run the script).  

Data include:
- Server Name
- Resolved IPv4 address (A)/ IPv6 address (AAAA, if any)
- IPv6 enabled flag
- City
- Server Info (Exit Node, Entry node, ED25519 Public key)
- P2P Feature Enabled
- Streaming Feature Enabled

The data source is from the [Undocumented Proton Endpoint](https://account.protonvpn.com/api/vpn/logicals), providing the following HTTP Headers   
(you can even save the response by going to [this page](https://account.protonvpn.com/downloads) after login, you can find the `/vpn/logicals` request in the network inspect section)
- x-pm-appversion
- x-pm-uid
- Cookie (This is the reason why it is not easily automated, it is not API token)

UPDATE on 2025-11-08:
Just found that the web version list is not complete so that this list is not the full list.  
The trick is to use a different `x-pm-appversion` value to not use the `web-vpn-settings`. 

The data script is also included for further customization if you have the api response file.