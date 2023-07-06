{{/*

The labels for all components:
  labels:
    helm.sh/chart: tfrs-frontend-1.0.0
    app.kubernetes.io/name: tfrs-frontend
    app.kubernetes.io/instance: tfrs-frontend-dev    or    tfrs-frontend-dev-jan
    app.kubernetes.io/version: "3.0.0"
    app.kubernetes.io/managed-by: Helm

The selector lables:
  selector:
    app.kubernetes.io/name: tfrs-frontend
    app.kubernetes.io/instance: tfrs-frontend-dev-1977

.Release.Name comes from command helm install
  example: helm install tfrs-frontend-dev ...  or  helm install tfrs-frontend-dev-jan ...

.Chart.Name come from the name attribute in Chart.yaml

*/}}

{{/*
Expand the name of the chart. If nameOverride is empty, use .Chart.Name.
Typically no need to assign value to nameOverride,
*/}}
{{- define "tfrs-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
The .Release.Name is the first parameter of command helm install tfrs-frontend-dev or tfrs-frontend-dev-jan
*/}}
{{- define "tfrs-frontend.fullname" -}}
{{- .Release.Name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "tfrs-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels:
app.kubernetes.io/managed-by would be Helm
*/}}
{{- define "tfrs-frontend.labels" -}}
helm.sh/chart: {{ include "tfrs-frontend.chart" . }}
{{ include "tfrs-frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "tfrs-frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "tfrs-frontend.name" . }}
app.kubernetes.io/instance: {{ include "tfrs-frontend.fullname" . }}
{{- end }}
