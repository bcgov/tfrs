import uuid
import os

from datetime import datetime

from django.db import transaction

from api.management.data_script import OperationalDataScript
from api.models.Organization import Organization
from api.models.OrganizationActionsType import OrganizationActionsType
from api.models.OrganizationBalance import OrganizationBalance
from api.models.OrganizationStatus import OrganizationStatus
from api.models.OrganizationType import OrganizationType
from api.models.Role import Role
from api.models.User import User
from api.models.UserRole import UserRole


class DockerEnvironment(OperationalDataScript):
    comment = 'Build development environment for docker compose'

    is_revertable = False

    _usernames = ['fs1',
                  'fs2',
                  'fs3',
                  'analyst',
                  'director',
                  'admin']

    _orgs = ['Fuel Supplier 1', 'Fuel Supplier 2', 'Fuel Supplier 3']

    _portbase = 10920
    _proxied_portbase = 5001

    def check_run_preconditions(self):
        for username in self._usernames:
            if User.objects.filter(username=username).exists():
                print('Found an existing user {}'.format(username))
                return False

        for org in self._orgs:
            if Organization.objects.filter(name=org).exists():
                print('Found an existing organization {}'.format(username))
                return False

        return True

    @transaction.atomic
    def run(self):

        Organization(name=self._orgs[0],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=2).save()
        Organization(name=self._orgs[1],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=3).save()
        Organization(name=self._orgs[2],
                     actions_type=OrganizationActionsType.objects.get_by_natural_key("Buy And Sell"),
                     type=OrganizationType.objects.get_by_natural_key("Part3FuelSupplier"),
                     status=OrganizationStatus.objects.get_by_natural_key('Active'), id=4).save()

        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[0]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()
        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[1]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()
        OrganizationBalance(organization=Organization.objects.get_by_natural_key(self._orgs[2]), credit_trade=None,
                            validated_credits=1000, effective_date=datetime.today().strftime('%Y-%m-%d')).save()

        User(email='fs1@email.com', authorization_guid=uuid.uuid4(), username='fs1', authorization_id='fs1',
             first_name='FS1', last_name='Supplier', display_name='Fuel Supplier', authorization_directory='BCeID',
             organization=Organization.objects.get_by_natural_key(self._orgs[0])).save()
        User(email='fs2@email.com', authorization_guid=uuid.uuid4(), username='fs2', authorization_id='fs2',
             first_name='FS2', last_name='Supplier', display_name='Another Fuel Supplier',
             authorization_directory='BCeID',
             organization=Organization.objects.get_by_natural_key(self._orgs[1])).save()
        User(email='fs3@email.com', authorization_guid=uuid.uuid4(), username='fs3', authorization_id='fs3',
             first_name='FS3', last_name='Supplier', display_name='Third Fuel Supplier',
             authorization_directory='BCeID',
             organization=Organization.objects.get_by_natural_key(self._orgs[2])).save()
        User(email='analyst@email.com', authorization_guid=uuid.uuid4(), username='analyst', authorization_id='analyst',
             first_name='Analyst', last_name='Government', display_name='(Analyst)', authorization_directory='IDIR',
             organization=Organization.objects.get(id=1)).save()
        User(email='director@email.com', authorization_guid=uuid.uuid4(), username='director',
             authorization_id='director', first_name='Director', last_name='Government', display_name='(Director)',
             authorization_directory='IDIR', organization=Organization.objects.get(id=1)).save()
        User(email='admin@email.com', authorization_guid=uuid.uuid4(), username='tfrsadmin', authorization_id='admin',
             first_name='Admin', last_name='Government', display_name='(Admin)', authorization_directory='IDIR',
             organization=Organization.objects.get(id=1)).save()

        UserRole(user=User.objects.get(username='fs1'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs2'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='fs3'), role=Role.objects.get_by_natural_key('FSManager')).save()
        UserRole(user=User.objects.get(username='analyst'), role=Role.objects.get_by_natural_key('GovUser')).save()
        UserRole(user=User.objects.get(username='director'), role=Role.objects.get_by_natural_key('GovDirector')).save()
        UserRole(user=User.objects.get(username='tfrsadmin'), role=Role.objects.get_by_natural_key('Admin')).save()

        self.dump_nginx_config()

    def dump_nginx_config(self):

        with open('/shared/reverse_proxy.conf', 'w') as f:
            conf = 'server {{\n' \
                   '\tlisten {port};\n' \
                   '\tserver_name localhost;\n' \
                   '\tlocation /api/ {{\n' \
                   '\t\tproxy_set_header Host $host;\n' \
                   '\t\tproxy_set_header X-Forwarded-For $remote_addr;\n' \
                   '\t\tproxy_pass http://django:8000/api/;\n' \
                   '\t}}\n' \
                   '\tlocation / {{\n' \
                   '\t\tproxy_set_header Host $host;\n' \
                   '\t\tproxy_set_header X-Forwarded-For $remote_addr;\n' \
                   '\t\tproxy_pass http://node:3000/;\n' \
                   '\t}}\n' \
                   '\tlocation /sockjs-node/ {{\n' \
                   '\t\tproxy_http_version 1.1;\n' \
                   '\t\tproxy_set_header Upgrade $http_upgrade;\n' \
                   '\t\tproxy_set_header Connection "Upgrade";\n' \
                   '\t\tproxy_set_header Host $host;\n' \
                   '\t\tproxy_pass http://node:3000/sockjs-node/;\n' \
                   '\t}}\n' \
                   '\tlocation /socket.io/ {{\n' \
                   '\t\tproxy_http_version 1.1;\n' \
                   '\t\tproxy_set_header Upgrade $http_upgrade;\n' \
                   '\t\tproxy_set_header Connection "Upgrade";\n' \
                   '\t\tproxy_set_header Host $host;\n' \
                   '\t\tproxy_pass http://node:3000/socket.io/;\n' \
                   '\t}}\n' \
                   '}}\n\n'.format(port=self._portbase)

            f.write(conf)

            f.write('# end of nginx config stanzas')

        try:
            os.mkdir('/shared/content')
        except FileExistsError:
            pass

        with open('/shared/content/index.html', 'w') as html:
            html.write('<html><head><title>TFRS Local Navigation</title></head>')
            html.write('<body>')
            html.write('<h1>TFRS Local Navigation</h1>')
            html.write('<p>The keycloak password for all users is <pre>tfrs</pre></p>')
            html.write('<p>Users available include:</p>')
            html.write('<ul>')
            for (i, username) in enumerate(self._usernames):
                conf = '<li>{user}</li>'.format(user=username)
                html.write(conf)
            html.write('</ul>')
            html.write('<h2><a target="_blank" href="http://localhost:{port}/">Access TFRS here</a></h2>'.
                       format(port=self._proxied_portbase))


            html.write('<h4><a target="_blank" href="http://localhost:8888/">'
                       'Keycloak Admin</a></h4>')

            html.write('<h4><a target="_blank" href="http://localhost:8080/">'
                       'Mailslurper (View sent mails)</a></h4>')

            html.write('<h4><a target="_blank" href="http://localhost:9000/">'
                       'Minio</a></h4>')

            html.write('</body></html>')


script_class = DockerEnvironment
