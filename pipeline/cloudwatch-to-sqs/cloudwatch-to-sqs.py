import os
import gzip
import base64
import json
import logging
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def decode_event_data(event_data):
    """Decode the data coming from a CloudWatch log event
    The Data is base64 encoded and gzip decompressed JSON in string format.
    """
    b64_decoded_data = base64.b64decode(bytes(event_data, 'utf-8'))
    decompressed_data = gzip.decompress(b64_decoded_data)
    return json.loads(decompressed_data)


def create_entries(log_events):
    """Create entries for SQS.send_message_batch()
    """
    entries = []
    for log_event in log_events:
        entries.append({
            'Id': log_event['id'],
            'MessageBody': log_event['message']
        })
    return entries

def send_to_sqs(queue_url, entries, client=boto3.client('sqs')):
    """Send log events to SQS queue
    """
    return client.send_message_batch(
        QueueUrl=queue_url,
        Entries=entries
    )

def handler(event, context):
    """Lambda handler
    """
    data = decode_event_data(event['awslogs']['data'])
    entries = create_entries(data['logEvents'])
    send_to_sqs(os.environ['SQS_ENDPOINT'], entries)
    return None

# Just if you want to run this locally
if __name__ == '__main__':
    test_event = {'awslogs': {'data': 'H4sIAAAAAAAAAGVSXY/aMBD8K1Ge7lTi87dj+hS1lKI7uAcitVI5IRMMWIQ4TcJVLeK/d2Pg1FOfrJ3dGc+OfYoPtm3N1ua/axsP489Zni2no/k8G4/iQex/VbYBWGBMBBYMU00BLv123PhjDR1/MImvXdX52pf7Y2KOa9clpd+7y9y8a6w5wODetwFrj6u2aFzdOV99cWVnmzYe/vhPp1e4iv3LSDaBEr8E8dGrrbqefordGu5gnCpGGEmJYpRzqgVXDMtUCY01J/2ZKqWlIpooJVNOuE4l5WCrcxBEZw6wExFMphKzlHHJBreAQP60iF/BLthYwNRgEfazP6FgmkHZQYZQBHwRA7DyvstBOIAUkzTBOiE0J2yIyZBhBHd/wCzM7nzbVeY6G8JKTF2T0Hsz916I5RTD1UPOEBPqJtTa5tUVdvZOK3RAr3SF6XPMb1ZXptjbah36R6ACCGt6tw5dgiiiXCIh+xMpJVKIL6Xy4stdDGmCiNCIYo40v3porzHddlFWG5PqTSIskQkXBifGbGxCNxTegGBhFXszkW3hXQN56v+4sjQPAuHobmqK/oO0u4/RpOpsGQEQPc+j7xHBS8KW8j7KYEX7za4eXfcgmEJMRnePX/Pp0yAq3d5GY1vs/X30adf4g32QKcKIcY4RwTKam41p3JW2iM9gxte2CXkFM4/ZbJ49ZZPZaLZ8eh5PZpfHMc3W9m5PPaPYmWpr21Ce4/PL+S9V77uqYgMAAA=='}}
    handler({}, {})