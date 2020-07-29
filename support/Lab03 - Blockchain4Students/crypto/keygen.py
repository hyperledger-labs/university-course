from Crypto.PublicKey import RSA
from Crypto.Signature.pkcs1_15 import PKCS115_SigScheme
import os

def generate_key_pair(node_id):

    key = RSA.generate(2048)
    file_priv = str(node_id) + "-private.pem"  # Find better way to do these names
    f = open(file_priv, 'wb+')
    f.write(key.export_key('PEM'))
    f.close()

    file_pub = str(node_id) + "-public.pem"
    f = open(file_pub, 'wb+')
    f.write(key.publickey().export_key('PEM'))
    f.close()


def sign_hash(h, node_id):
    file_priv = str(node_id) + "-private.pem"
    if not os.path.exists(file_priv):
        return None
    f = open(file_priv, 'r')
    priv_key = RSA.import_key(f.read())  # Read private key from file
    signer = PKCS115_SigScheme(priv_key)
    signature = signer.sign(h)
    f.close()
    return signature


def verify_sig(hc, signature, node_id):
    file_pub = str(node_id) + "-public.pem"
    if not os.path.exists(file_pub):
        raise Exception("Public key does not exist")
    f = open(file_pub, 'r')
    try:
        pub_key = RSA.import_key(f.read())  # Read public key from file
        f.close()
        signer = PKCS115_SigScheme(pub_key)
        signer.verify(hc, signature)
    except:
        raise Exception("Signature failed, integrity and/or signature value was not upheld")



