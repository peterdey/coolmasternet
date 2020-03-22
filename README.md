CoolMasterNet-Control
==============

![Web Gui Preview](https://raw.githubusercontent.com/peterdey/daikin-control/master/web_gui.png)

The [CoolAutomation ``CoolMasterNet``](https://coolautomation.com/products/coolmasternet/) allows control over a wide range of Air Conditoning systems.

Firmware version 0.7.6 introduced a REST API, which exposes most of the functionality in a JSON (or JSON-esque) manner.

While Cool Automation have a Mobile App, I'd prefer not to have exploitable IoT devices on a VLAN that has Internet access.

##Tested Hardware
```
Model:              CoolMasterNet CM-1187
Firmware version:   0.8.2 (PCB Rev 5.7)
HVAC System:        Toshiba CRF
```

##API System
The REST API documentation is available here: https://coolautomation.com/wp-content/uploads/sites/2/2019/09/CoolMasterNet-REST-API-spec.pdf
Relevant commands and general output are documented here: https://coolautomation.com/Lib/doc/prm/CoolAutomation-PRM-CoolMasterNet-v0.7.pdf
