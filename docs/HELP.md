# Debug help

## Connect to pi

### Direct ethernet connection

1. Connect a TP-cable between your computer and the Pi.
2. On Linux, change/create the *wired connection* settings on your computer to *link-local*/*Share to other computers* or similar. On Ubuntu 17.10, you need to start the old network manager using `nm-connection-editor` in the console.
3. SSH is already enabled on the image, and a local IP-address is assigned to the Pi using DHCP as soon as the TP-cable is attached (your host will act as a DHCP server). You can now connect using default username and hostname, and password *pi*.

```bash
ssh pi@raspberrypi.local
```

### .local doesn't work on direct connections

Try find the IP-address of the `pi` by e.g. looking in the DHCP leases table:

```bash
cat /var/lib/misc/dnsmasq.leases
```

Connect using
```bash
ssh pi@<IP address>
```

### Wifi

Ensure the `pi` is connected to the Wifi. 

Try connect to it using:
```bash
ssh pi@<hostname>.local
```

If you're still using the default hostname `raspberrypi`, it will probably collide with the other teams.

### .local doesn't work on Wifi

You'll need to figure out the IP address of your `pi`.

If you're still connected using [direct connect](#direct-ethernet-connection), you'll find the IP-address on the `pi` by typing:
```bash
ifconfig
```

Then simply SSH to it (from your host computer, duh):

```bash
ssh pi@<ip addr>
```

#### nmap

The really slow way is to search the network for all devices with port 22 (SSH) open. Since *JaywayGuest* is a /16 type network, there are 16382 subnets and 65534 hosts to search, which will take around 20 minutes:

```bash
nmap -sS -T5 -p 22 10.0.0.0/16
```

See [https://explainshell.com/explain?cmd=nmap+10.0.0.1+-T5+-p-+-sS+](https://explainshell.com/explain?cmd=nmap+10.0.0.1+-T5+-p-+-sS+) for a description of the `nmap` options.

## Problems with Donkey library import paths

If you're having trouble with import paths being prepended with the git directory name after installing the [Donkey](https://github.com/wroscoe/donkey) library, try installing it without the `-e` flag:

```bash
# Assuming you've cloned the git to ~/donkey
pip install ~/donkey
```