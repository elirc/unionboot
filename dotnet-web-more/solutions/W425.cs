// W425: Channel worker contracts / Drain channel batches of 5
namespace DotnetWeb;
public static class W425{

public static Task<int> Drain(ChannelReader<int> reader,ICollection<int> sink,CancellationToken token){
token.ThrowIfCancellationRequested();int n=0;while(n<5&&reader.TryRead(out var item)){sink.Add(item);n++;}return Task.FromResult(n);
}
}
