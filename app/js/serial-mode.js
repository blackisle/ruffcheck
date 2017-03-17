const os = require('os');
const SerialPort = require("serialport");
var result


function confirm_serialResetSystem() {
    if (confirm("确定板卡重置吗？")) {
        if (confirm("此操作将会清除开发板上的设置和数据。")) {
            progressDisplay('scroll-tab-2-progress')
            document.getElementById('scroll-tab-2-output').innerHTML = ''
            checkConnection('scroll-tab-2-output', 'scroll-tab-2-progress', serialResetSystem);
        } else {
            alert("取消板卡重置")
            progressDisplayNone('scroll-tab-2-progress')
            document.getElementById('scroll-tab-2-output').innerHTML = ''
        }
    } else {
        alert("取消板卡重置");
        progressDisplayNone('scroll-tab-2-progress')
        document.getElementById('scroll-tab-2-output').innerHTML = ''
    }
}

function confirm_resetGetBootLog() {
    if (confirm("获取日志需要重启开发板")) {
        if (confirm("点击确定后，按下开发板上的红色 HRESET 按钮，整个过程需要大约 2 分钟")) {
            progressDisplay('scroll-tab-3-progress')
            document.getElementById('scroll-tab-3-output').innerHTML = ''
            serialGetBootLog()
        } else {
            alert("取消");
            document.getElementById('scroll-tab-3-output').innerHTML = ''
        }
    } else {
        alert("取消");
        document.getElementById('scroll-tab-3-output').innerHTML = ''
    }
}

function serialResetSystem() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''
        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('jffs2reset -y && reboot &\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /Linux.version.3.18.21/;
            var result = output.match(re)[0]

            if (result == null) {
                progressDisplayNone('scroll-tab-2-progress');
                document.getElementById('scroll-tab-2-output').innerHTML = '<h3>' + '重试一次' + '</h3>';
                port.close();
            }
            else {
                progressDisplayNone('scroll-tab-2-progress');
                document.getElementById('scroll-tab-2-output').innerHTML = '<h3>' + '重置成功' + '</h3>';
                port.close();
            }
        }, 15000)

    }, 4000);
}

function getSerialList() {
    var SerialPort = require('serialport');
        $('#selectSerialList').html('<option value=""></option>')

    SerialPort.list(function (err, ports) {
        var serialList = []
        ports.forEach(function (port) {
            serialList.push(port.comName)
        });

        serialList.forEach(function (serial) {
            $('#selectSerialList').append('<option value=' + serial + '>' + serial + '</option>')
        })
    });
}

function serialGetVersion() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });

        var output = ''
        port.on('data', function (data) {
            output = output.concat(data.toString())
        });


        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('cat /etc/ruff_version\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /\d\.\d\.\d/g;
            var result = output.match(re)

            if (result == null) {
                // progressDisplay('scroll-tab-1-output-version')
                document.getElementById('scroll-tab-1-output-version').innerHTML = '<h3>' + '重试一次' + '</h3>'
                port.close()
            }
            else {
                document.getElementById('scroll-tab-1-output-version').innerHTML = '<h3>系统版本：' + result[0] + '</h3>'
                port.close()
            }
        }, 2000)
    }, 1000);
}

function serialGetWiFi() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });

        var output = '';
        port.on('data', function (data) {
            output = output.concat(data.toString());
        });


        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('ifconfig\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /wlan0\s[\s\S]*?inet addr:([\d.]*)/;
            var result = output.match(re)[1]

            if (result == null) {
                document.getElementById('scroll-tab-1-output-wifi').innerHTML = '<h3>' + 'WiFi：重试一次' + '</h3>'
                port.close()
            }
            else if (result == '192.168.78.1') {
                document.getElementById('scroll-tab-1-output-wifi').innerHTML = '<h3>' + 'WiFi：未配置' + '</h3>'
                port.close()
            }
            else {
                document.getElementById('scroll-tab-1-output-wifi').innerHTML = '<h3>WiFi 地址：' + result + '</h3>'
                port.close()
            }
        }, 2000)

    }, 1000);
}


function serialGetEthernet() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''
        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('ifconfig\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
        });

        setTimeout(function () {
            var re = /eth0.2\s[\s\S]{0,100}inet addr:([\d.]*)/;

            if (output.match(re) == null) {
                document.getElementById('scroll-tab-1-output-ethernet').innerHTML ='<h3>' + '以太网：未连接' + '</h3>'
                port.close()
            }
            else {
                document.getElementById('scroll-tab-1-output-ethernet').innerHTML ='<h3>以太网 IP 地址：' + output.match(re)[1] + '</h3>'
                port.close()
            }
        }, 2000)

    }, 1000);
}


function serialGetLog() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });
        var output = ''

        port.on('data', function (data) {
            output = output.concat(data.toString())
        });

        port.on('open', function () {
            port.write(' \n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            port.write('dmesg\n', function (err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });
            setTimeout(function () {
                port.write('logread\n', function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                });
            }, 3000);
        });

        setTimeout(function () {
            output = output.replace(/root@OpenWrt:\/# dmesg/,'###Log###')
            progressDisplayNone('scroll-tab-3-progress')
            document.getElementById('scroll-tab-3-output').innerText = output
            progressDisplay('scroll-tab-3-output')
            port.close()
        }, 10000)

    }, 1000);
}

function serialGetBootLog() {
    setTimeout(function () {
        var port = new SerialPort(
            selectSerial, {
                baudRate: 57600, //波特率
                dataBits: 8, //数据位
                parity: 'none', //奇偶校验
                stopBits: 1, //停止位
                flowControl: false
            });

            port.on('open', function () {
                setTimeout(function () {
                    port.write(' \n', function (err) {
                        if (err) {
                            return console.log('Error on write: ', err.message);
                        }
                    });

                    port.write('dmesg\n', function (err) {
                        if (err) {
                            return console.log('Error on write: ', err.message);
                        }
                    });

                    port.write('logread\n', function (err) {
                        if (err) {
                            return console.log('Error on write: ', err.message);
                        }
                    });
                }, 90000);
            });


        var output = ''

        port.on('data', function (data) {
            output = output.concat(data.toString())
        });


        setTimeout(function () {
            progressDisplayNone('scroll-tab-3-progress')
            output = output.replace(/root@OpenWrt:\/# dmesg/,'###Log###')
            output = output.replace(/root@OpenWrt:\/# logread/,'###Log###')
            output = output.replace(/dmesg/,'')
            output = output.replace(/logread/,'')
            output = output.replace(/root@OpenWrt:\/#/,'')
            document.getElementById('scroll-tab-3-output').innerText = output
            progressDisplay('scroll-tab-3-output')
            port.close()
        }, 110000)


    }, 1000);
}

function serialGetInfo() {
    serialGetVersion()

    setTimeout(function(){
        serialGetWiFi()
    }, 3000)

    setTimeout(function(){
        serialGetEthernet()
    }, 6000)

    setTimeout(function(){
        progressDisplay('scroll-tab-1-output')
        progressDisplayNone('scroll-tab-1-progress')
    }, 10000)
}

function checkConnection(tab, progress, action){
    setTimeout(function () {
            var port = new SerialPort(
                selectSerial, {
                    baudRate: 57600, //波特率
                    dataBits: 8, //数据位
                    parity: 'none', //奇偶校验
                    stopBits: 1, //停止位
                    flowControl: false
                });
            var output = '';

            port.on('data', function (data) {
                output = output.concat(data.toString());
            });


            port.on('open', function () {
                port.write(' \n', function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                });
                port.write('cat /etc/openwrt_release\n', function (err) {
                    if (err) {
                        return console.log('Error on write: ', err.message);
                    }
                });
            });


            setTimeout(function () {
                var re = /DISTRIB_DESCRIPTION='OpenWrt Chaos Calmer 15.05'/;
                var result = output.match(re)

                if (result == null) {
                    progressDisplayNone(progress)
                    document.getElementById(tab).innerHTML = '<h3>' + '串口暂时无法使用，请确认连接后重试。' + '</h3>'
                    port.close()
                }
                else {
                    port.close()
                    action();
                }
            }, 1000)

        }, 1000);
}