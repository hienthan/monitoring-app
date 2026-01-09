API chuẩn nên dùng (nhẹ, ổn định)
Base
http://10.13.34.176:19999

1. CPU Usage

Chart: system.cpu

GET /api/v1/data
?chart=system.cpu
&format=json
&after=-60
&points=1


Lấy các dimension chính:

user

system

idle

iowait

👉 Demo thường chỉ cần:

CPU usage = 100 - idle

2. RAM / Memory

Chart: system.ram

GET /api/v1/data
?chart=system.ram
&format=json
&after=-60
&points=1


Dimension cần:

used

free

cached (optional)

👉 Demo logic:

RAM used / total

3. Disk I/O

Chart: system.io

GET /api/v1/data
?chart=system.io
&format=json
&after=-60
&points=1


Dimension:

in

out

👉 Thể hiện:

Disk read (KB/s)

Disk write (KB/s)

4. Network I/O

Chart: system.net

GET /api/v1/data
?chart=system.net
&format=json
&after=-60
&points=1


Dimension:

received

sent

👉 Thể hiện:

Inbound

Outbound

1 - cpu:
http://10.13.34.176:19999/api/v1/data?chart=system.cpu&after=-60&group=average&points=1&format=json
reponse:
    {
        "labels":["time","guest_nice","guest","steal","softirq","irq","user","system","nice","iowait"],
        "data":[
            [1767860040,0,1.0496287,0,0.3697528,0,9.2761318,1.922111,0,0.2067554]
        ]
    }

2- ram:
http://10.13.34.176:19999/api/v1/data?chart=system.ram&after=-60&group=average&points=1&format=json
{
  "labels": [
    "time",
    "free",
    "used",
    "cached",
    "buffers"
  ],
  "data": [
    [1767920657, 15604.652, 20659.04, 26681.54, 1209.2656]
  ]
}

3-Disk I/O:http://10.13.34.176:19999/api/v1/data?chart=system.io&after=-60&group=average&points=1&format=json
{
  "labels": [
    "time",
    "reads",
    "writes"
  ],
  "data": [
    [1767919140, 72.4666668, -969.4569845]
  ]
}

4 - Network I/O

{
  "labels": [
    "time",
    "received",
    "sent"
  ],
  "data": [
    [1767919260, 3081.662115, -3003.8416517]
  ]
}
