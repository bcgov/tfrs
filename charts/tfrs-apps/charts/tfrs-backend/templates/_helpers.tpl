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

*/}}

{{/*
Expand the name of the chart.
*/}}
{{- define "tfrs-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
The .Release.Name is the first parameter of command helm install tfrs-backend
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
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Define the deploymentconfig name
*/}}
{{- define "tfrs-backend.deploymentconfigName" -}}
{{- include "tfrs-backend.fullname" . }}
{{- end }}

{{/*
Define the deploymentconfig name
*/}}
{{- define "tfrs-backend.imagestreamName" -}}
{{- include "tfrs-backend.fullname" . }}
{{- end }}

{{/*
Define the service name
*/}}
{{- define "tfrs-backend.serviceName" -}}
{{- include "tfrs-backend.fullname" . }}
{{- end }}


{{/*
Define the backend route name
*/}}
{{- define "tfrs-backend.routeName" -}}
{{- include "tfrs-backend.fullname" . }}
{{- end }}

{{/*
Define the backend admin route name, used by task queue
*/}}
{{- define "tfrs-backend.adminRouteName" -}}
tfrs-backend-admin{{ .Values.suffix }}
{{- end }}

{{/*
Define the backend static route name, used by task queue
*/}}
{{- define "tfrs-backend.staticRouteName" -}}
tfrs-backend-static{{ .Values.suffix }}
{{- end }}

{{/*
Define the djangoSecretKey
*/}}
{{- define "tfrs-backend.djangoSecretKey" -}}
{{- randAlphaNum 50 | nospace | b64enc }}
{{- end }}

{{/*
Define the djangoSaltKey
*/}}
{{- define "tfrs-backend.djangoSaltKey" -}}
{{- randAlphaNum 50 | nospace | b64enc }}
{{- end }}

{{/*
Define the django-secret name
*/}}
{{- define "tfrs-backend.django-secret" -}}
tfrs-django-secret
{{- end }}

{{/*
Define the django-salt name
*/}}
{{- define "tfrs-backend.django-salt" -}}
tfrs-django-salt
{{- end }}