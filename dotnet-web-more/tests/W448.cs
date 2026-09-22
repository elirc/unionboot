using static DotnetWeb.W448;
namespace DotnetWeb;
public static class TestsW448{public static async Task Run(){await Task.CompletedTask;
{
using var provider=new CaptureProvider();var logger=provider.CreateLogger("worker");var error=new InvalidOperationException("oops");Record(logger,"alpha",9,error);Check.Equal(1,provider.Entries.Count);var e=provider.Entries[0];Check.Equal(LogLevel.Information,e.Level);Check.Equal(107,e.EventId.Id);Check.Equal("job",e.EventId.Name);Check.True(ReferenceEquals(error,e.Error));Check.Equal("Job alpha processed 9",e.Message);Check.Equal("alpha",e.Values["Job"]?.ToString());Check.Equal("Job {Job} processed {Count}",e.Values["{OriginalFormat}"]?.ToString());
}
{
using var provider=new CaptureProvider();Record(provider.CreateLogger("worker"),"beta",0,null);Check.True(provider.Entries[0].Error is null);Check.Equal("0",provider.Entries[0].Values["Count"]?.ToString());
}
}}
