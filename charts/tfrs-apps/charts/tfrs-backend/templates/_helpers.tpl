{{/*

The labels for all components:
  labels:
    helm.sh/chart: tfrs-backend-1.0.0
    app.kubernetes.io/name: tfrs-backend
    app.kubernetes.io/instance: tfrs-backend-dev    or    tfrs-backend-dev-jan
    app.kubernetes.io/version: "3.0.0"
    app.kubernetes.io/managed-by: Helm

The selector lables:
  selector:
    app.kubernetes.io/name: tfrs-backend
    app.kubernetes.io/instance: tfrs-backend-dev-1977

.Release.Name comes from command helm install
  example: helm install tfrs-backend-dev ...  or  helm install tfrs-backend-dev-jan ...

.Chart.Name come from the name attribute in Chart.yaml

*/}}

{{/*
Expand the name of the chart. If nameOverride is empty, use .Chart.Name.
Typically no need to assign value to nameOverride,
*/}}
{{- define "tfrs-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
The .Release.Name is the first parameter of command helm install tfrs-backend-dev or tfrs-backend-dev-jan
*/}}
{{- define "tfrs-backend.fullname" -}}
{{- .Release.Name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "tfrs-backend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels:
app.kubernetes.io/managed-by would be Helm
*/}}
{{- define "tfrs-backend.labels" -}}
helm.sh/chart: {{ include "tfrs-backend.chart" . }}
{{ include "tfrs-backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "tfrs-backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "tfrs-backend.name" . }}
app.kubernetes.io/instance: {{ include "tfrs-backend.fullname" . }}
{{- end }}

