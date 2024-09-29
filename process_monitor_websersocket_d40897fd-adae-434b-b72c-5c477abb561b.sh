pid_websersocket=$(pgrep -f "websersocket_d40897fd-adae-434b-b72c-5c477abb561b.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd