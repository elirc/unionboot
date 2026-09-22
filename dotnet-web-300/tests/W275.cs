using static DotnetWeb.W275;
namespace DotnetWeb;
public static class TestsW275 { public static async Task Run() {
 await Task.CompletedTask;
{
  var store=new Cache();var clock=new ManualClock();int calls=0;string Load()=>"v"+(++calls);var first=await Check.Execute(Handle("a",store,clock,Load));Check.Json(first,"cached",false);var second=await Check.Execute(Handle("a",store,clock,Load));Check.Json(second,"value","v1");Check.Json(second,"cached",true);Check.Equal(1,calls);clock.Advance(TimeSpan.FromSeconds(5));var third=await Check.Execute(Handle("a",store,clock,Load));Check.Json(third,"value","v2");Check.Json(third,"cached",false);Check.Equal(2,calls);Check.Status(400,Handle(" ",store,clock,Load));Check.Equal(2,calls);
 }
 {
 var empty=new Cache();Check.Throws<InvalidOperationException>(()=>Handle("x",empty,new ManualClock(),()=>throw new InvalidOperationException()));Check.Equal(0,empty.Values.Count);
 }
} }
