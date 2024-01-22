from django.db import migrations, transaction, models
import collections

def update_report_fields(apps, schema_editor):
    ComplianceReport = apps.get_model('api', 'compliancereport')
    for report in ComplianceReport.objects.filter(supplements__isnull=False):
        with transaction.atomic():
            ancestor = report
            root = None
            latest = None
            while ancestor.supplements is not None:
                ancestor = ancestor.supplements

            visited = []
            id_traversal = {}
            to_visit = collections.deque([ancestor.id])
            i = 0

            while len(to_visit) > 0:
                current_id = to_visit.popleft()

                # break loops
                if current_id in visited:
                    continue
                visited.append(current_id)

                current = ComplianceReport.objects.get(id=current_id)

                if current.supplements is None:
                    root = current
                    latest = current
                # don't count non-supplement reports (really should just be the root)
                if current.supplements is not None and \
                        not current.status.fuel_supplier_status_id == "Deleted":
                    latest = current
                    i += 1
                id_traversal[current_id] = i
                for descendant in current.supplemental_reports.order_by('create_timestamp').all():
                    to_visit.append(descendant.id)

            for compliance_id, traversal in id_traversal.items():
                ComplianceReport.objects.filter(id=int(compliance_id)) \
                    .update(latest_report=latest, root_report=root, traversal=traversal)


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0018_alter_compliace_report_history_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='compliancereport',
            name='traversal',
            field=models.IntegerField(default=0),
        ),
        migrations.RunPython(update_report_fields, reverse_code=migrations.RunPython.noop),
    ]
