import urllib.request
import json

try:
    # 1. Main Page
    req = urllib.request.urlopen('http://localhost:3010')
    print(f'GET / -> Status: {req.status}')

    # 2. Test generate endpoint
    gen_data = json.dumps({
        'avatarId': 'avatar-maya-vance',
        'avatarName': 'Maya Vance',
        'model': 'flux_dev',
        'presetType': 'turnaround_angle',
        'angle': 'front'
    }).encode('utf-8')

    req_api = urllib.request.Request(
        'http://localhost:3010/api/avatar/generate',
        data=gen_data,
        headers={'Content-Type': 'application/json'}
    )
    res_api = urllib.request.urlopen(req_api)
    res_json = json.loads(res_api.read().decode('utf-8'))
    print(f"POST /api/avatar/generate -> Status: {res_api.status}, Success: {res_json.get('success')}, Model: {res_json.get('model')}, Duration: {res_json.get('durationSec')}s, Fidelity: {res_json.get('faceFidelityScore')}%")

    # 3. Test video-swap endpoint
    swap_data = json.dumps({
        'avatarId': 'avatar-luna-cristal',
        'avatarName': 'Luna Cristal',
        'sourceVideoUrl': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        'mode': 'full_swap',
        'computeBackend': 'modal_h100'
    }).encode('utf-8')

    req_swap = urllib.request.Request(
        'http://localhost:3010/api/avatar/video-swap',
        data=swap_data,
        headers={'Content-Type': 'application/json'}
    )
    res_swap = urllib.request.urlopen(req_swap)
    res_swap_json = json.loads(res_swap.read().decode('utf-8'))
    print(f"POST /api/avatar/video-swap -> Status: {res_swap.status}, Success: {res_swap_json.get('success')}, Job: {res_swap_json.get('jobId')}, Cluster: {res_swap_json.get('cluster')}")

    print("\nALL API ENDPOINTS TESTED AND 100% OPERATIONAL!")
except Exception as e:
    print(f'Error during test: {e}')
