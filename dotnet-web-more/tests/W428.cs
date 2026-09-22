using static DotnetWeb.W428;
namespace DotnetWeb;
public static class TestsW428{public static async Task Run(){await Task.CompletedTask;
{
var channel=Channel.CreateUnbounded<int>();for(int i=0;i<10;i++)channel.Writer.TryWrite(i);channel.Writer.Complete();var sink=new List<int>();Check.Equal(8,await Drain(channel.Reader,sink,default));Check.Equal(Enumerable.Range(0,8).ToArray(),sink.ToArray());Check.True(channel.Reader.TryRead(out var next));Check.Equal(8,next);
}
{
var channel=Channel.CreateUnbounded<int>();var sink=new List<int>();Check.Equal(0,await Drain(channel.Reader,sink,default));channel.Writer.TryWrite(9);using var source=new CancellationTokenSource();source.Cancel();await Check.ThrowsAsync<OperationCanceledException>(()=>Drain(channel.Reader,sink,source.Token));Check.Equal(0,sink.Count);Check.True(channel.Reader.TryRead(out var item));Check.Equal(9,item);
}
}}
