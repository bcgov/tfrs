{{/*

The labels for all components:
  labels:
    helm.sh/chart: tfrs-celery-1.0.0
    app.kubernetes.io/name: tfrs-celery
    app.kubernetes.io/instance: tfrs-celery-dev    or    tfrs-celery-dev-jan
    app.kubernetes.io/version: "3.0.0"
    app.kubernetes.io/managed-by: Helm

The selector lables:
  selector:
    app.kubernetes.io/name: tfrs-celery
    app.kubernetes.io/instance: tfrs-celery-dev-1977

.Release.Name comes from command helm install
  example: helm install tfrs-celery-dev ...  or  helm install tfrs-celery-dev-jan ...

.Chart.Name come from the name attribute in Chart.yaml

*/}}

{{/*
Expand the name of the chart. If nameOverride is empty, use .Chart.Name.
Typically no need to assign value to nameOverride,
*/}}
{{- define "tfrs-celery.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
The .Release.Name is the first parameter of command helm install tfrs-celery-dev or tfrs-celery-dev-jan
*/}}
{{- define "tfrs-celery.fullname" -}}
{{- .Release.Name }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "tfrs-celery.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels:
app.kubernetes.io/managed-by would be Helm
*/}}
{{- define "tfrs-celery.labels" -}}
helm.sh/chart: {{ include "tfrs-celery.chart" . }}
{{ include "tfrs-celery.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "tfrs-celery.selectorLabels" -}}
app.kubernetes.io/name: {{ include "tfrs-celery.name" . }}
app.kubernetes.io/instance: {{ include "tfrs-celery.fullname" . }}
{{- end }}
