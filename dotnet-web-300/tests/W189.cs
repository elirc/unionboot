using static DotnetWeb.W189;
namespace DotnetWeb;
public static class TestsW189 { public static async Task Run() {
 await Task.CompletedTask;
{
  using var source=new CancellationTokenSource();var c=Check.Context();c.RequestAborted=source.Token;int calls=0;var result=await Handle(c,token=>{Check.Equal(source.Token,token);calls++;return Task.FromResult(3);});var r=await Check.Execute(result);Check.Json(r,"amount",27);Check.Equal(1,calls);
 }
 {
 var canceled=Check.Context();canceled.RequestAborted=new CancellationToken(true);int count=0;await Check.ThrowsAsync<OperationCanceledException>(async()=>{await Handle(canceled,_=>{count++;return Task.FromResult(1);});});Check.Equal(0,count);
 }
 {
 using var late=new CancellationTokenSource();var lc=Check.Context();lc.RequestAborted=late.Token;await Check.ThrowsAsync<OperationCanceledException>(async()=>{await Handle(lc,_=>{late.Cancel();return Task.FromResult(1);});});
 }
 {
 Check.Equal(200, (await Check.Execute(await Handle(Check.Context(),_=>Task.FromResult(int.MaxValue)))).Response.StatusCode);
 }
} }
