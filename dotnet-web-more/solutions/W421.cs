// W421: Channel worker contracts / Drain channel batches of 1
namespace DotnetWeb;
public static class W421{

public static Task<int> Drain(ChannelReader<int> reader,ICollection<int> sink,CancellationToken token){
token.ThrowIfCancellationRequested();int n=0;while(n<1&&reader.TryRead(out var item)){sink.Add(item);n++;}return Task.FromResult(n);
}
}
