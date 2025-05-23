## Prerequisites
-Since this Prometheus instance is intended to monitor a Kubernetes cluster, the first step is to provision the cluster using kOps. Detailed instructions for setting up the cluster can be found below. [here](https://github.com/techlearn-center/DevOps/blob/CICD/Kubernetes/kOps.md) . 

- Installing and configuring Helm:

Download the binaries, extract it and put it in /usr/local/bin/helm.

Change to the `/tmp` directory—commonly used for temporary file storage. It's a convenient location for downloading and unpacking binaries that don’t need to be stored permanently, especially during software installation.
```
cd /tmp
```
To install the binaries, download them using the following command:
```
wget https://get.helm.sh/helm-v3.14.4-linux-amd64.tar.gz
```

Extract the binary with the following command:
```
tar xzvf  helm-v3.14.4-linux-amd64.tar.gz
```

We now have the Helm binary, and we will move it to `/usr/local/bin/helm`.
```
sudo mv /tmp/linux-amd64/helm /usr/local/bin/helm
```
```
cd
```
```
helm --help
```

After the cluster is provisioned and helm installed, follow the steps outlined below to install Prometheus and Grafana:

Steps to Install Prometheus:
--------------------------------
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```
```
helm search repo prometheus
```
```
helm repo update
```
```
helm install prometheus prometheus-community/prometheus
```
```
helm list
```
```
kubectl get all
```

-To make the service—normally accessible only within the cluster—available externally, we’ll expose it on each node’s IP address at a specific port. This approach can be useful for external access or for debugging purposes.

Running the command below prompts Kubernetes to create a new Service object that routes external traffic—from each node on a specific port (automatically assigned if not specified)—to port `9090` on the pods targeted by the original `prometheus-kube-prometheus-prometheus` service. This effectively makes the Prometheus server accessible from outside the cluster.

```
kubectl expose service prometheus-kube-prometheus-prometheus --type=NodePort --target-port=9090 --name=prometheus-server-ext
```
or use below depending on the service name you got
```
kubectl expose service prometheus-server --type=NodePort --target-port=9090 --name=prometheus-server-ext 
```

#### Alternatively, if you prefer to specify a custom NodePort rather than letting Kubernetes assign one automatically, you can use the `--node-port` option with the command above. This allows you to define the exact port on each node’s network interface where the service will be exposed. 

However, make sure the port you choose falls within the valid NodePort range configured on your Kubernetes cluster—typically between `30000` and `32767`. This range can vary depending on your cluster’s specific configuration.

```
kubectl expose service prometheus-kube-prometheus-prometheus --type=NodePort --port=9090 --target-port=9090 --name=prometheus-server-ext --node-port=32000
```

- To find out which node the prometheus-kube-prometheus pod is scheduled on, use the following command:
```
kubectl get pods -o wide|grep prometheus-prometheus-kube-prometheus-prometheus-0|awk '{print  $7}'
```
or use below depending on the pod name (prometheus-server)
```
kubectl get pods -o wide|grep prometheus-server|awk '{print  $7}'
```

- Now that you have the node name, navigate to your EC2 dashboard, search for that specific EC2 instance, and note its IP address. 

- Additionally, make sure to edit the security group to allow traffic on the port that Prometheus is listening on. 

- To find out which port Prometheus is using, you can use the following command:
prometheus-server-ext

```
echo $(kubectl get svc prometheus-server-ext -o=jsonpath='{.spec.ports[0].nodePort}')
```
- You can now access Prometheus by opening your browser and navigating to the IP address and port in the format `http://IP:Port`. For example, use `http://3.93.10.212:32531/`, where `3.93.10.212` is the IP address of the EC2 instance hosting your Grafana pod, and `32531` is the NodePort assigned for accessing Prometheus.



Steps to install Grafana:
--------------------------
```
helm repo add grafana https://grafana.github.io/helm-charts
```
```
helm repo update
```
```
helm install grafana grafana/grafana
```
```
kubectl expose service grafana --type=NodePort --target-port=3000 --name=grafana-ext
```

To know which node the Grafana pod is scheduled on, use below command 
```
kubectl get pods -o wide | grep 'grafana' | awk '{print  $7}'
```
- Now that you have the node name, navigate to your EC2 dashboard, search for that specific EC2 instance, and note its IP address. 

- Additionally, make sure to edit the security group to allow traffic on the port that Grafana is listening on. 

- To find out which port Grafana is using, you can use the following command:
```
kubectl get svc |grep grafana-ext|awk '{print $5}'|cut -d":" -f2|cut -d"/" -f1
```
or 
```
echo $(kubectl get svc grafana-ext -o=jsonpath='{.spec.ports[0].nodePort}')
```
- You can now access Grafana by opening your browser and navigating to the IP address and port in the format `http://IP:Port`. For example, use `http://3.93.10.212:32531/`, where `3.93.10.212` is the IP address of the EC2 instance hosting your Grafana pod, and `32531` is the NodePort assigned for accessing Grafana.

- Your Grafana dashboard is now operational. To access it, please enter the username and password. To retrieve these credentials, use the following command:

```
kubectl get secret  grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo
```

All the above commands pertains to you working in the default namespace

----------------------------------------------------------

Here are Grafana dashboard templates that you can import (just use the IDs): 
- [Dashboard 6417](https://grafana.com/grafana/dashboards/6417)
- [Dashboard 3662](https://grafana.com/grafana/dashboards/3662)
