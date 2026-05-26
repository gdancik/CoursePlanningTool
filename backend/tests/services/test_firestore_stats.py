import sys
import os

# Add the greatgrandparent directory to the Python path -- required for direct testing of this file
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

import pytest
import backend.services.firestore_stats as fs_stats

def test_create_delete_summarize_tables():
    fs_stats.delete_all_tables()
    fs_stats.create_tables()
    fs_stats.increase_number_writes('test_user', 5)
    fs_stats.increase_number_reads('test_user', 10)
    fs_stats.increase_number_deletes('test_user', 2)
    summary = fs_stats.summarize_tables('test_user')
    assert summary['num_writes'][0] == 5
    assert summary['num_reads'][0] == 10
    assert summary['num_deletes'][0] == 2
    assert fs_stats.get_writes('test_user').shape[0] > 0
    assert fs_stats.get_reads('test_user').shape[0] > 0
    assert fs_stats.get_deletes('test_user').shape[0] > 0
    fs_stats.delete_all_tables()