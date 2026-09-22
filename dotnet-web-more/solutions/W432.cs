// W432: Hosted service lifecycle / Clock lifecycle duration 2 minutes
namespace DotnetWeb;
public static class W432{
public sealed class State{public DateTimeOffset? Started{get;set;}public DateTimeOffset? Stopped{get;set;}public List<string> Events{get;}=new();}
public static IHostedService Create(TimeProvider clock,State state){
return new DelegateHost(token=>{token.ThrowIfCancellationRequested();if(state.Started is null){state.Started=clock.GetUtcNow();state.Events.Add("start");}return Task.CompletedTask;},token=>{token.ThrowIfCancellationRequested();if(state.Started is not null&&state.Stopped is null){state.Stopped=clock.GetUtcNow();state.Events.Add("stop");}return Task.CompletedTask;});
}
}
