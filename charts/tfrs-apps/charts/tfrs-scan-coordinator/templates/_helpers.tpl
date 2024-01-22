{{/*

The labels for all components:
  labels:
    helm.sh/chart: tfrs-scan-coordinator-1.0.0
    app.kubernetes.io/name: tfrs-scan-coordinator
    app.kubernetes.io/instance: tfrs-scan-coordinator-dev    or    tfrs-scan-coordinator-dev-jan
    app.kubernetes.io/version: "3.0.0"
    app.kubernetes.io/managed-by: Helm

The selector lables:
  selector:
    app.kubernetes.io/name: tfrs-scan-coordinator
    app.kubernetes.io/instance: tfrs-scan-coordinator-dev-1977

.Release.Name comes from command helm install
  example: helm install tfrs-scan-coordinator-dev ...  or  helm install tfrs-scan-coordinator-dev-jan ...

.Chart.Name come from the name attribute in Chart.yaml

*/}}

{{/*
Expand the name of the chart. If nameOverride is empty, use .Chart.Name.
Typically no need to assign value to nameOverride,
*/}}
{{- define "tfrs-scan-coordinator.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
The .Release.Name is the first parameter of command helm install tfrs-scan-coordinator-dev or tfrs-scan-coordinator-dev-jan
*/}}
{{- define "tfrs-scan-coordinator.fullname" -}}
{{- .Release.Name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "tfrs-scan-coordinator.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels:
app.kubernetes.io/managed-by would be Helm
*/}}
{{- define "tfrs-scan-coordinator.labels" -}}
helm.sh/chart: {{ include "tfrs-scan-coordinator.chart" . }}
{{ include "tfrs-scan-coordinator.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "tfrs-scan-coordinator.selectorLabels" -}}
app.kubernetes.io/name: {{ include "tfrs-scan-coordinator.name" . }}
app.kubernetes.io/instance: {{ include "tfrs-scan-coordinator.fullname" . }}
{{- end }}
