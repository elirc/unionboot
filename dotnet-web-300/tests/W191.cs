using static DotnetWeb.W191;
namespace DotnetWeb;
public static class TestsW191 { public static async Task Run() {
 await Task.CompletedTask;
{
  var c=Check.Context();int visited=0;bool disposed=false;async IAsyncEnumerable<int> Source(){try{for(int n=1;n<=3;n++){visited++;yield return n;await Task.Yield();}}finally{disposed=true;}}await Handle(c,Source());Check.Equal(1,visited);Check.True(disposed);Check.Equal("application/x-ndjson; charset=utf-8",c.Response.ContentType);Check.Equal(string.Concat(Enumerable.Range(1,1).Select(n=>"{\"value\":"+n+"}\n")),Check.Body(c));
 }
 {
 var empty=Check.Context();await Handle(empty,Check.Sequence());Check.Equal("",Check.Body(empty));var canceled=Check.Context();canceled.RequestAborted=new CancellationToken(true);await Check.ThrowsAsync<OperationCanceledException>(()=>Handle(canceled,Check.Sequence(1)));
 }
} }
