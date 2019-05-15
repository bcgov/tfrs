import smtpd
import asyncore

def main():
    smtpd.DebuggingServer(('0.0.0.0', 2500), ('127.0.0.1', 25))
    print('Waiting for SMTP connections')
    try:
        asyncore.loop()
    except KeyboardInterrupt:
        pass
    print('Shutting down event loop')

if __name__ == "__main__":
    main()
