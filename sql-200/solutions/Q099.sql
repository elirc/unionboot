SELECT seconds,datetime(seconds,'unixepoch') AS utc FROM epochs ORDER BY seconds;
