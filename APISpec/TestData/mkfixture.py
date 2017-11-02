#!/c/Python27/python

import sys
import json
import os

if len(sys.argv) < 4:
    print "Syntax error - arguments missing"
    print "Usage: %s <input filename> <output path> <django model>" % sys.argv[0]
    sys.exit()
input_filename = sys.argv[1]
fixture_path = sys.argv[2]
model = sys.argv[3]
fixture_filename = '%s/%s.json' % (fixture_path, model)

if not (os.path.isfile(input_filename) and os.access(input_filename, os.R_OK)):
    print "Error: Either file is missing or is not readable"
    sys.exit(1)

with open(input_filename, 'r') as f:
    datastore = json.load(f)

fixture = []
# Convert data to fixture format
#   add the model name
#   Find the id, make it the pk and delete the id
#   set fields to be the data
#   add the result to the fixture array for output
for record in datastore:
    fix = {}
    fix['model'] = 'server.%s' % model
    fix['pk'] = record['id']
    del record['id']
    fix['fields'] = record
    fixture.append(fix)

json_data = json.dumps(fixture, sort_keys=True, indent=4, separators=(',', ': '))

print 'Generating fixture for model: %s' % (model)
with open(fixture_filename, 'w') as f:
    f.write(json_data)

sys.exit(0)
